<?php

namespace Shkeeper\Gateway\Model;

use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Payment\Model\Method\AbstractMethod;

class Shkeeper extends AbstractMethod
{

    protected $_code = 'shkeeper';
    protected $_isOffline = true;

}
